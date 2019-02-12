exports.getOption = () => {
    return product
}

exports.getVersion = () => {
    return '1.0.0'
}

const dev = {
    'isPhD': true,
    'BrowserIcon': 'assets/img/hakuBackground.png',
    'Icon': 'ico/haku.ico',
    'processPath': './',
    'GeneratorExecuatablePath': '.\\Executable\\MMDPreviewGenerator.exe',
    'GeneratorResolution': {
        'width': 1920,
        'height': 1440,
    }
}

const product = {
    'isPhD': false,
    'BrowserIcon': 'assets/img/hakuBackground.png',
    'Icon': 'ico/haku.ico',
    'processPath': './',
    'GeneratorExecuatablePath': '.\\Executable\\MMDPreviewGenerator.exe',
    'GeneratorResolution': {
        'width': 960,
        'height': 720,
    }
}