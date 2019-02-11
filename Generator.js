const path = require('path')
const fs=require('fs')
const crypto = require('crypto')
const exec = require('child-process-promise').exec;
 
var container = []
var processSuccessContainers = []
var processFailedContainers = []
var pmdContainer = []

const postFix = '_preview.'

const GeneratorExecuatablePath = require('./config').getOption().GeneratorExecuatablePath
const GeneratorResolution = require('./config').getOption().GeneratorResolution

exports.GenerateAll = (MMDpath) => {
    return new Promise((resolve, reject) => {
        
        container = []
        processSuccessContainers = []
        processFailedContainers = []
        pmdContainer = [] // Clear container

        CheckfromDir(MMDpath,'.pmd')
        CheckfromDir(MMDpath,'.pmx')
        .then(GeneratePreview)
        .then((Processed)=>{
            // Processed = [ allSkipedPmxModels, ProcessedPmxModels, ProcessFailedPmxModels, PmdModels]
            resolve(JSON.stringify(Processed, null, 4))
        })
    })
}

if (require.main === module && process.argv.length == 3) {
    exports.GenerateAll(process.argv[2]).then((Processed)=>{
        console.log(JSON.stringify(Processed, null, 4))
    })
}

function ExecCommand(command, commandPath, data)
{
    return new Promise((resolve, reject) => {
        exec(command, {cwd: __dirname + commandPath}).then(function (result) {
            let stdout = result.stdout;
            let stderr = result.stderr;
            console.log(`stdout: ${stdout}`);
            if(stderr.length > 0){
                console.log(`stderr: ${stderr}`);
                processFailedContainers.push(data)
            }            
            else{
                processSuccessContainers.push(data)
            }
            resolve(true)
        })
        .catch(function (err) {
            console.log(`ERROR:  ${err}`);
            processFailedContainers.push(data)
            resolve(false)
        })
    })
}

function GeneratePreview()
{
    return new Promise((resolve, reject) => {
        let tasks = []

        let reduced = container.reduce((acc, ele) => {
            return ele.preview === `NULL` ? acc : acc.concat(ele)
        }, [])

        let shouldProcessContainers = container.reduce((acc, ele) => {
            return ele.preview !== `NULL` ? acc : acc.concat(ele)
        }, [])

        console.log(`Skip ${pmdContainer.length} PMD models`);

        console.log(`Skip ${reduced.length} PMX models`);

        console.log(`Should Process: ${shouldProcessContainers.length} models`);

        for(var i = 0; i < shouldProcessContainers.length; ++i) {
            let data = shouldProcessContainers[i]           
            let previewPathPNG = data.path.substring(0, data.path.length - ".pmx".length) + postFix + "png"
            let commandPath = GeneratorExecuatablePath.substring(0, GeneratorExecuatablePath.lastIndexOf('\\'))
            let executableLocalPath = GeneratorExecuatablePath.substring(GeneratorExecuatablePath.lastIndexOf('\\') + 1)
            let command = `.\\${executableLocalPath} ${GeneratorResolution.width} ${GeneratorResolution.height} ${data.path} ${previewPathPNG}`
            tasks.push(ExecCommand(command, commandPath, data))
        }

        Promise.all(tasks).then(res => resolve([reduced, processSuccessContainers, processFailedContainers, pmdContainer]))
    })
}

function CheckfromDir(startPath, filter, callback)
{
    return new Promise((resolve, reject) => {
        let files = fs.readdirSync(startPath);
        for(var i = 0; i < files.length; ++i) {
            let filename = path.join(startPath, files[i])
            let stat = fs.lstatSync(filename)
            if ( stat.isDirectory() ) {
                CheckfromDir(filename, filter); //recurse
            }
            else if (filename.indexOf(filter) >= 0) {
                let previewPathJPG = filename.substring(0, filename.length - ".pmx".length) + postFix + "jpg"
                let previewPathPNG = filename.substring(0, filename.length - ".pmx".length) + postFix + "png"
                let hasModel = filename.indexOf(".pm") == (filename.length - ".pmx".length) // .pm for pmx and pmd compability
                let isPMD = filename.indexOf(".pmd") == (filename.length - ".pmd".length)

                if(hasModel){
                    name = (filename.lastIndexOf("\\") != -1) ? filename.substring(filename.lastIndexOf("\\") + 1, filename.length - ".pmx".length) : filename
                    if(isPMD){
                        pmdContainer.push({
                            "name" : name,
                            "path" : filename,
                            "preview": fs.existsSync(previewPathJPG) ? previewPathJPG :
                                        (fs.existsSync(previewPathPNG) ? previewPathPNG : 'NULL')
                        })
                    }
                    else{
                        container.push({
                            "name" : name,
                            "path" : filename,
                            "preview": fs.existsSync(previewPathJPG) ? previewPathJPG :
                                        (fs.existsSync(previewPathPNG) ? previewPathPNG : 'NULL')
                        })
                    }
                }
            }
        }
        resolve(container);
    })
}
