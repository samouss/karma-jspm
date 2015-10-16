/*
 * Copyright 2014-2015 Workiva Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(karma, System) {
    if (!System) {
        throw new Error("SystemJS was not found. Please make sure you have " +
            "initialized jspm via installing a dependency with jspm, " +
            "or by running 'jspm dl-loader'.");
    }

    // System.config({ baseURL: 'base' });
    if ( !System.baseURL ) {
        System.config({ baseURL: 'base' });
    }

    var promises = [],
      stripExtension = typeof karma.config.jspm.stripExtension === 'boolean' ? karma.config.jspm.stripExtension : true;

    // Prevent immediately starting tests.
    karma.loaded = function() {

        if(karma.config.jspm.paths !== undefined &&
            typeof karma.config.jspm.paths === 'object') {
            System.config({
                paths: karma.config.jspm.paths
            });
        }

        if(karma.config.jspm.meta !== undefined &&
            typeof karma.config.jspm.meta === 'object') {
            System.config({
                meta: karma.config.jspm.meta
            });
        }

        // Exclude bundle configurations if useBundles option is not specified
        if(!karma.config.jspm.useBundles){
            System.bundles = [];
        }

        // Load everything specified in loadFiles
        for (var i = 0; i < karma.config.jspm.expandedFiles.length; i++) {
            var modulePath = karma.config.jspm.expandedFiles[i];
            var promise = System['import'](extractModuleName(modulePath))
                ['catch'](function(e) {
                    throw e;
                });
            promises.push(promise);
        }

        // Promise comes from the systemjs polyfills
        Promise.all(promises).then(function() {
            karma.start();
        });
    };

    function extractModuleName(fileName) {
        if (stripExtension) {
            return fileName.replace(/\.js$/, "");
        }
        return fileName;
    }
})(window.__karma__, window.System);
