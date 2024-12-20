const {z} = require('zod');

const auth = z.object({
    title : z.string().min(1,{msg:'Title is Required'}),
    description: z.string().min(1,{msg:'Description is Required'}),

})

const id_auth = z.object({
    _id : z.string().min(1,{msg:'_id is required!'})
})

module.exports={
    authentication:auth,
    authentication_id:id_auth
}