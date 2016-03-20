"use strict";
import React = require('react');
import ReactDOM = require('react-dom');
import QuadGraphContainer = require('./QuadGraphContainer');
import WindowSize = require('./util/WindowSize');
ReactDOM.render(<QuadGraphContainer size={WindowSize.getSize()}/>, document.getElementById("appcontainer"));