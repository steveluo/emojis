const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const del = require('del');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const path = require('path');
const pngquant = require('imagemin-pngquant');

const emojiCssPath = '../img/emoji/';

const emojiSrc = './emoji';
const dest = './dist';
const imgDest = path.resolve(dest, 'img/emoji');
const cssDest = path.resolve(dest, 'css/');

var spriteEmoji = function(emojiName) {
    var spriteData = gulp.src(path.join(emojiSrc, emojiName, '*.png'))
                         .pipe(spritesmith({
//                              algorithm: 'emojis',
                              imgName: emojiName + '.sprites.png',
                              cssName: emojiName + '.sprites.css',
                              imgPath: emojiCssPath + emojiName + '.sprites.png',
                              cssTemplate: './emoji.css.handlebars',
                              cssVarMap: function (sprite) {
                                  sprite.backgroundX = (sprite.x * 100 / (sprite.total_width * (40/41)));
                                  sprite.backgroundY = (sprite.y * 100 / (sprite.total_height * (38/39)));
                              }
                         }));

    var imgStream = spriteData.img
               .pipe(buffer())
               .pipe(imagemin({
                   use: [pngquant()]
               }))
               .pipe(gulp.dest(imgDest))
               ;

    var cssStream = spriteData.css.pipe(gulp.dest(cssDest));

  return merge(imgStream, cssStream);
}

gulp.task('emoji-apple', function() {
    return spriteEmoji('apple');
});

gulp.task('emoji-google', function() {
    return spriteEmoji('google');
});

gulp.task('emoji-twitter', function() {
    return spriteEmoji('twitter');
});

gulp.task('emoji-emoji-one', function() {
    return spriteEmoji('emojione');
});

gulp.task('optimize-image', function() {
  return gulp.src('generated/*.png')
           .pipe(imagemin({ use: [ pngquant() ] }))
           .pipe(gulp.dest(imgDest))
});

gulp.task('emojis', ['emoji-apple', 'emoji-twitter', 'emoji-emoji-one']);

gulp.task('copy-custom-emojis', function() {
    return gulp.src(path.join(emojiSrc, "*.png"))
               .pipe(gulp.dest(imgDest));
});

gulp.task('copy-json', function() {
    return gulp.src(path.join(emojiSrc, "*.json"))
               .pipe(gulp.dest(dest));
});

gulp.task('clean', function() {
    del([dest], { force: true });
});


gulp.task('default', ['emojis', 'copy-custom-emojis', 'copy-json']);

