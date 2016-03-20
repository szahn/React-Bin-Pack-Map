'use strict';
var gulp = require('gulp');
var del = require('del');
var webpack = require('webpack-stream');

gulp.task('buildApp', function(){
	return gulp.src(['app/binPackMapApp.tsx']).pipe(webpack({  
	  output: {
	    filename: 'react-bin-pack-map.js'
	  },
	  resolve: {
	    extensions: ['','.tsx', '.ts', '.js']
	  },
	  module: {
	    loaders: [
	      { test: /\.(tsx|ts)$/, loader: 'ts-loader' }
	    ]
	  }})
	).pipe(gulp.dest("./dist/"));
});


gulp.task('build', ["buildApp"]);
