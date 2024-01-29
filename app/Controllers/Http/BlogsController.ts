import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post";
import UptadePostValidator from "App/Validators/UptadePostValidator";
import Database from "@ioc:Adonis/Lucid/Database";
import Category from "App/Models/Category";

export default class BlogsController {

  async index({view, request}: HttpContextContract) {
    let page = request.input('page',1)
    const posts = await Database.from(Post.table).paginate(page, 2)

    return view.render('blog/index', {
      posts, // Corrected the variable name to "posts"
    })
  }

  async create({ view }: HttpContextContract) {
    const post = new Post();
    const categories = await Category.all()
    console.log(categories)
    return view.render('blog/create',{
      categories,
      post
    }) // Assurez-vous que ce template existe
  }

  async show({params, view}: HttpContextContract) {

    const post = await Post.query().preload('category').where('id',params.id).firstOrFail()
    const categories = await Category.all()

    return view.render('blog/show', {
      post,
      categories
    })
  }

async store({params, request, session, response }: HttpContextContract){
  await this.handleRequest(params,request)
  session.flash({success: "L\'article a bien été crée"})
  return response.redirect().toRoute('home')

  }




  async update({ params, request, response, session }: HttpContextContract) {
   await this.handleRequest(params,request)
    session.flash({success: "L\'articcle a bien été sauvegardé"})
    return response.redirect().toRoute('home')
  }

  async destroy({params,session, response}: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
     await post.delete()
    session.flash({success: "L\'article a bien été supprimer"})
    return response.redirect().toRoute('home')

  }
  private async handleRequest(params: HttpContextContract['params'], request: HttpContextContract['request']) {
    const post = params.id ? await Post.findOrFail(params.id) : new Post();
    const data = await request.validate(UptadePostValidator)
    post
      .merge({...data, online: data.online || false})
      .save()
  }


}
