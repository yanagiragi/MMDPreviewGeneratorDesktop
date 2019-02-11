exports.getOption = () => {
    return dev
}

exports.getVersion = () => {
    return '1.0.0'
}


const dev = {
    'isDev': true,
    'isPhD': false,
    'limit': false,
    'asar': false,
    'JsonPath': 'json', // no '/' at last character
    'DonePath': 'json/done.json',
    'BlockedPath': 'json/blocked.json',
    'StoragePath': 'Storage',
    'StorageBookPath': 'Storage/Books',
    'BrowserIcon': 'assets/img/hakuBackground.png',
    'Icon': 'ico/haku.ico',
    'processPath': './'
}

const limitedAsarOption = {
    'limit': true,
    'asar': true,
    'JsonPath': '../json',
    'DonePath': '../json/done.json',
    'BlockedPath': '../json/blocked.json',
    'StoragePath': '../Storage',
    'StorageBookPath': '../Storage/Books',
    'BrowserIcon': 'assets/img/hakuGaussian2.png',
    'Icon': 'ico/haku.ico',
    'processPath': './resources'
}

const AsarOption = {
    'limit': false,
    'asar': true,
    'JsonPath': '../json',
    'DonePath': '../json/done.json',
    'BlockedPath': '../json/blocked.json',
    'StoragePath': '../Storage',
    'StorageBookPath': '../Storage/Books',
    'BrowserIcon': 'assets/img/hakuGaussian2.png',
    'Icon': 'ico/haku.ico',
    'processPath': './resources'
}

const phdOpenOption = {
    'isPhD': true,
    'limit': false,
    'asar': false,
    'JsonPath': '../../json',
    'DonePath': '../../json/done.json',
    'BlockedPath': '../../json/blocked.json',
    'StoragePath': '../../Storage',
    'StorageBookPath': '../../Storage/Books',
    'BrowserIcon': 'assets/img/dsr50.png',
    'Icon': 'ico/dsr.ico',
    'processPath': './resources/app'
}