module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    ts: {
      default: {
        // specifying tsconfig as a boolean will use the 'tsconfig.json' in same folder as Gruntfile.js
        tsconfig: true
      },
      // default : {
      //   src: ["src/*.ts", "!node_modules/**", '!bin/**', "www.js"],
      //   dest: "./dist/",
      //   options: {
      //     module: 'commonjs',
      //     // compiler: './node_modules/grunt-ts/customcompiler/tsc'
      //   }
      // }

      // app: {
      //   files: [{
      //     src: ["src/*.ts", "!node_modules/**", "!typings/**"],
      //     // src: ["src/**/*.ts", "!src/.baseDir.ts", "!src/_all.d.ts"],
      //     dest: "./dist/"
      //   }],
      //   options: {
      //     module: "commonjs",
      //     fast: "never",
      //     // noLib: true,
      //     target: "es5",
      //     sourceMap: true,
      //     noImplicitAny: true,
      //     moduleResolution: "node",
      //     outDir: "./dist/"
      //   },
      //   exclude: [
      //     "node_modules",
      //     "target",
      //     "typings",
      //     "dist"
      //   ]
      // }
    },
    // typescript: {
    //   base: {
    //     src: ['src/*.ts'],
    //     dest: './dist/',
    //     options: {
    //       module: 'commonjs', //or commonjs
    //       target: 'es6', //or es3
    //       basePath: 'node_modules/@types',
    //       sourceMap: true,
    //       declaration: true
    //     }
    //   }
    // },
    tslint: {
      options: {
        configuration: "tslint.json"
      },
      files: {
        src: ["server/src/**/*.ts", "client/src/**/*.ts"]
      }
    },
    watch: {
      ts: {
        files: ["server/src/**/*.ts", "client/src/**/*.ts"],
        tasks: ["ts"]
        // tasks: ["typescript"]
        // tasks: ["ts", "tslint"]
      }
    },
    copy: {
      build: {
        files: [
          // {
          //   expand: true,
          //   cwd: "./client/public",
          //   src: ["**"],
          //   dest: "./dist/client/public"
          // },
          {
            expand: true,
            cwd: "server/",
            src: ["www"],
            dest: "dist/server"
          }
        ]
      }
    },
  });

  // grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-tslint");

  grunt.registerTask("default", [
    "copy",
    "ts"
  ]);

  // grunt.registerTask("default", [
  //   "ts",
  //   "tslint"
  // ]);

};