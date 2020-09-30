module.exports = {

    name :'ping',
    description :"",
    execute(message, args){
       message.channel.send('pong') ;
    }

}