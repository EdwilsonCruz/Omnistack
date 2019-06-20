const Post = require('../models/post');

module.exports = {
    async store(req, res){
        //select * from post where id= (req.params.id) - id pego por paramentro.
        const post = await Post.findById(req.params.id);
        //add +1 na contagem de likes.
        post.likes +=1;
        //enviando a requisição pro banco e salvando.
        await post.save();

        req.io.emit('like', post);

        return res.json(post);
    }
}