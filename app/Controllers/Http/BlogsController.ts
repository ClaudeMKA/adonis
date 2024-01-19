import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post";
import UptadePostValidator from "App/Validators/UptadePostValidator";

export default class BlogsController {

  async index({view}: HttpContextContract) {
    const posts = await Post.all()

    return view.render('blog/index', {
      posts, // Corrected the variable name to "posts"
    })
  }

  async show({params, view}: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
    return view.render('blog/show', {
      post,
    })
  }

  async update({ params, request, response, session }: HttpContextContract) {
    try {
      const post = await Post.findOrFail(params.id);
      await request.validate(UptadePostValidator); // Valider les données

      post.merge(request.all()).save();

      session.flash({ success: "L'article a bien été sauvegardé" });

      return response.redirect().toRoute('home');
    } catch (error) {
      // Afficher les erreurs dans la console
      console.log(error.messages);

      // Gérer les erreurs de validation ici
      session.flash({ error: "Erreur de validation" }); // Remplacez par un message plus précis
      return response.redirect().back();
    }
  }


}
