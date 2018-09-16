
import io
import os
import json
from google.protobuf.json_format import MessageToJson
from google.cloud import vision
from PIL import Image, ImageDraw
from enum import Enum
import argparse

# Note: you need the aws CLI installed with configured credentials
# You also must install the python google vision client and pillow lib
# pip install --upgrade google-cloud-vision
# pip install --upgrade Pillow

# you must have google user credentials set as environment variable before running this script.
# i.e. 'export GOOGLE_APPLICATION_CREDENTIALS=/Users/stuart/.google/credentials


class FeatureType(Enum):
    PAGE = 1
    BLOCK = 2
    PARA = 3
    WORD = 4
    SYMBOL = 5


def draw_boxes(image, bounds, color):
    """Draw a border around the image using the hints in the vector list."""
    draw = ImageDraw.Draw(image)

    for bound in bounds:
        draw.polygon([
            bound.vertices[0].x, bound.vertices[0].y,
            bound.vertices[1].x, bound.vertices[1].y,
            bound.vertices[2].x, bound.vertices[2].y,
            bound.vertices[3].x, bound.vertices[3].y], None, color)
    return image


def get_document_bounds(response, feature):
    """Returns document bounds given an image."""
    document = response.full_text_annotation
    bounds = []
    full_text = []
    for page in document.pages:
        for block in page.blocks:
            for paragraph in block.paragraphs:
                for word in paragraph.words:
                    for symbol in word.symbols:
                        if (feature == FeatureType.SYMBOL):
                            bounds.append(symbol.bounding_box)
                            full_text.append(symbol.text)
                    if (feature == FeatureType.WORD):
                        bounds.append(word.bounding_box) 
                if (feature == FeatureType.PARA):
                    bounds.append(paragraph.bounding_box)
            if (feature == FeatureType.BLOCK):
                bounds.append(block.bounding_box)
        if (feature == FeatureType.PAGE):
            bounds.append(block.bounding_box)

    ocr_text = ''.join([symbol for symbol in full_text])
    return (ocr_text, bounds)


def process_response(imgFile, ocr_response):
    image = Image.open(imgFile)
    (text, bounds) = get_document_bounds(ocr_response, FeatureType.WORD)
    with open(imgFile + ".ocr.txt", "w") as text_file:
        text_file.write(text)
    draw_boxes(image, bounds, 'blue')
    image.save(imgFile + ".bounds.jpg")
    image.show()


def ocr_image(client, imgFile):
    print("Performing ocr on {0}".format(imgFile))
    with io.open(imgFile, 'rb') as image_file:
        content = image_file.read()
    image = vision.types.Image(content=content)
    ocr_response = client.document_text_detection(image=image)
    with open(imgFile + ".ocr.json", 'w') as outfile:
        json.dump(MessageToJson(ocr_response), outfile)
    process_response(imgFile, ocr_response)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('image_file', help='The image for text detection.')
    args = parser.parse_args()
    client = vision.ImageAnnotatorClient()
    ocr_image(client, args.image_file)
