module.exports = {
    setPoll: async function (userID, userName, ctx, type) {
        const chatID = ctx.chat.id;
        var text = '';
        if (type == 'kick') {
            text = `¿Expulsar al usuario ${userName}?`;
        } else if (type == 'admin') {
            text = `Ascender al usuario ${userName} a administrador?`;
        }
        const poll = await ctx.replyWithPoll(text,['SI','NO']);
        const pollID = poll.message_id;
    
        setTimeout(async() => {
            const res = await stopPoll(chatID, pollID, ctx);
            const usuarios = await ctx.getChatMembersCount();
    
            const votos = res.total_voter_count;
            const resOK = res.options[0].voter_count;
            const resNOK = res.options[1].voter_count;
    
            if(((usuarios-1)/2)<votos) {
                if(resOK > resNOK) {
                    if (type == 'kick') {
                        ctx.reply(`Se ha decidido por mayoría expulsar al usuario ${userName}`);
                        ctx.kickChatMember(userID);
                    } else if (type == 'admin') {
                        ctx.reply(`Se ha decidido por mayoría ascender al usuario ${userName} a administrador`);
                        ctx.promoteChatMember(userID);
                    }
                } else {
                    if (type == 'kick') {
                        ctx.reply(`Los usuarios del grupo han decidido no expulsar a ${userName}`);
                    } else if (type == 'admin') {
                        ctx.reply(`Los usuarios del grupo han decidido no expulsar a ${userName}`);
                    }
                }
            } else {
                ctx.reply('No han votado suficientes usuarios.');
            }
        }, 60000);
    }
}

let stopPoll = async(chatID, pollID, ctx) => {
    console.log(chatID);
    console.log(pollID);
    const res = ctx.stopPoll(pollID);
    return res;
}