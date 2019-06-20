const Post = require('../models/post');
//manipular imagens
const sharp= require('sharp');
const path = require('path');
//file system
const fs   = require('fs');

module.exports = {
    async index(req, res){
        //-createdAt = 'Desc' no sql
        const posts = await Post.find().sort('-createdAt');
        return res.json(posts);
    },
    async store(req, res){
        //console.log(req.body);
        const {author, place, description, hashtags} = req.body;
        const {filename: image} = req.file;
        const [name] = image.split('.');
        const fileName = `${name}.jpg`;

        console.log('Caminho do Arq: '+req.file.path);
        //return res.json(req.file);
        await sharp(req.file.path)
            .resize(500)
            .jpeg({quality:70})
            .toFile(
                path.resolve(req.file.destination,'resized',fileName)
            )
            fs.unlinkSync(req.file.path);

        const post = await Post.create({
            author,
            place,
            description,
            hashtags,
            image: fileName,
        });
        
        req.io.emit('post', post);
        //return res.json({OK: true, msg:"teste"});
        return res.json(post);
    },
	
    async delete(req, res) {
        console.log({id:req.params.id});
        //encontra o dado selecionado, para retornar o valor da image.
        const post1 = await Post.findById(req.params.id);
        console.log(post1);
        
        //apaga a imagem, do diretorio.
        fs.unlinkSync('C:\\workspace_EC\\rocketseat_aula\\backend\\uploads\\resized\\'+ post1.image);
        //deleta no banco, a linha referente a este id.
        const post = await Post.findByIdAndDelete(req.params.id);        
		await post.save();
		//const posts = await Post.find().sort('-createdAt');	
		
		req.io.emit('del', post);
		
        //retorno de sucesso.
        return res.json(post);
    }
}