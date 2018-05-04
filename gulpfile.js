const { join } = require('path')
const gulp = require('gulp')
const { src } = require('gulp')
const { createProject } = require('gulp-typescript')
const { init, mapSources, write } = require('gulp-sourcemaps')
const del = require('del')

const project = createProject('tsconfig.json')

gulp.task('default', ['build:test'])
gulp.task('dist', ['build:dist'])

gulp.task('compile:test', ['clean:test'], compiler('lib'))
gulp.task('compile:dist', ['clean:dist'], compiler('dist'))

gulp.task('build', ['build:test'])
gulp.task('build:test', ['clean:test', 'compile:test'])
gulp.task('build:dist', ['clean:dist', 'compile:dist'])

gulp.task('clean', ['clean:all'])
gulp.task('clean:all', clean('lib', 'dist'))
gulp.task('clean:test', clean('lib'))
gulp.task('clean:dist', clean('dist'))

function clean(...dests) {
	return () => del(dests.map(dest => dest + '/**.*.*'))
}

function compiler(dest) {
	dest += '/'
	return () => {
		const tsCompile = src('src/**/*.ts')
			.pipe(init({ base: 'src' }))
			.pipe(project())

		tsCompile.pipe(gulp.dest(dest))

		const sources = ['src/**/*.js', 'src/**/*.json', 'src/**/*.lang']
		src(sources).pipe(gulp.dest(dest))

		return tsCompile.js
			.pipe(mapSources(p => join(__dirname, 'src', p)))
			.pipe(write())
			.pipe(gulp.dest(dest))
	}
}
