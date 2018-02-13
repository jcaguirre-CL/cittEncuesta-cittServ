var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: "http://localhost:3005",
        port: 8085,
        ui: {
            port: 8085 //levanta la interfaz de usuario de browserSync
        }
    });
    //gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("cittserv-api/public/*.html").on('change', browserSync.reload);
    gulp.watch("cittserv-api/public/*.js").on('change', browserSync.reload);
    gulp.watch("cittserv-api/public/bootstrap/css/*.css").on('change', browserSync.reload);
});
