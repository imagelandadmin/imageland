import { Component, Inject, OnInit } from '@angular/core';
import { Logger } from 'aws-amplify';

/**
 * Base component from which all others should inherit.
 * Should be used for common concerns such as logging and error handling.
 */
export class BaseComponent implements OnInit {

    public log = new Logger(this.constructor.name, 'INFO');

    ngOnInit() {
        this.log.info("ngOnInit");
    }
}