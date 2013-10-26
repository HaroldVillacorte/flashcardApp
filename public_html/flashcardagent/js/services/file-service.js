flashcardAgent.factory('fileService', function(Message) {
    var fileSystem = {
        fs: undefined,
        getBlobUrl: (window.URL && URL.createObjectURL.bind(URL)) ||
                (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) ||
                window.createObjectURL,
        revokeBlobUrl: (window.URL && URL.revokeObjectURL.bind(URL)) ||
                (window.webkitURL && webkitURL.revokeObjectURL.bind(webkitURL)) ||
                window.revokeObjectURL,
        getDataUrl: function(file) {

        },
        errorHandler: function(e) {
            var msg = '';
            switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                    msg = 'File system quota exceed: ' + e.code;
                    break;
                case FileError.NOT_FOUND_ERR:
                    msg = 'NOT_FOUND_ERR';
                    break;
                case FileError.SECURITY_ERR:
                    msg = 'SECURITY_ERR';
                    break;
                case FileError.INVALID_MODIFICATION_ERR:
                    msg = 'INVALID_MODIFICATION_ERR';
                    break;
                case FileError.INVALID_STATE_ERR:
                    msg = 'INVALID_STATE_ERR';
                    break;
                default:
                    msg = 'Unknown Error';
                    break;
            }
            Message.set(msg, 'alert');
        },
        onInit: function(result) {
            this.fs = (result) ? result : undefined;
            console.log((this.fs) ? 'File system ready.' : 'File system unavailable.');
        },
        init: function() {
//            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
//            window.requestFileSystem(PERSISTENT, 5 * 1024 * 1024 * 1024, this.onInit, this.errorHandler);
        },
        dropImage: function($file) {
            var file = $file[0];
            var type = file.type;
            var result;
            var imgStr = 'image/jpeg image/png image/gif';
            if (imgStr.indexOf(type) !== -1) {
                result = this.getBlobUrl($file[0]);
                Message.reset();
            }
            else {
                Message.set('Not a valid image type.  Please pick a jpeg, png, or gif.', 'alert');
            }
            return result;
        }
    };

    return fileSystem;
});
