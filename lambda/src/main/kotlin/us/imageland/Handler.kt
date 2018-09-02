package us.imageland

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import graphql.GraphQL
import graphql.schema.StaticDataFetcher
import graphql.schema.idl.RuntimeWiring
import graphql.schema.idl.RuntimeWiring.newRuntimeWiring
import graphql.schema.idl.SchemaGenerator
import graphql.schema.idl.SchemaParser
import org.apache.logging.log4j.LogManager
import java.io.File
import graphql.parser.Parser


class Handler: RequestHandler<Map<String, Any>, ApiGatewayResponse> {

  companion object {
    private val LOG = LogManager.getLogger(Handler::class.java)
    private var graphQL: GraphQL? = null
  }

  private fun initGraphQL(): GraphQL {
    val startTime = System.currentTimeMillis()
    LOG.info("Initializing graphQL on cold boot.")

    val schemaParser = SchemaParser()
    val schemaFile = File(Handler::class.java.getResource("imageland.graphqls").file)
    val typeDefinitionRegistry = schemaParser.parse(schemaFile)

    val schemaGenerator = SchemaGenerator()
    val runtimeWiring = buildRuntimeWiring()
    val graphQLSchema = schemaGenerator.makeExecutableSchema(typeDefinitionRegistry, runtimeWiring)

    graphQL = GraphQL.newGraphQL(graphQLSchema).build()
    LOG.info("Done initializing graphQL. ProcessingTime=${System.currentTimeMillis() - startTime}")
    return graphQL!!
  }

  private fun buildRuntimeWiring(): RuntimeWiring {
    return newRuntimeWiring()
            .type("QueryType") { builder ->
              builder.dataFetcher("welcome", StaticDataFetcher("Welcome to Imageland!"))
            }
            .build()
  }

  override fun handleRequest(input:Map<String, Any>, context:Context): ApiGatewayResponse {
    val startTime = System.currentTimeMillis()
    val query = queryFromQueryString(input["queryStringParameters"] as? Map<String,Any>?) ?:
                queryFromBody(input["body"] as String?)

    LOG.info("Begin request. Query=$query")

    val executionResult = graphQL?.execute(query) ?: initGraphQL().execute(query)
    val response = executionResult?.getData<Any>()?.toString() ?: "null"
    LOG.info("End request. ProcessingTime=${System.currentTimeMillis() - startTime} Response=$response")

    return ApiGatewayResponse.build {
      statusCode = 200
      objectBody = DataResponse(response, input)
      headers = mapOf("X-Powered-By" to "AWS Lambda & serverless")
    }
  }

  fun queryFromBody(body: String?): String? {
    LOG.info("body: $body")

    return null
  }

  fun queryFromQueryString(queryStringMap: Map<String,Any>?): String? {
    val query = queryStringMap?.get("query")?.toString()
    return if (query != null) "{${query}}" else null
  }
}
