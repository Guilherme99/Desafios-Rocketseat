const express = require("express");
const cors = require("cors");
const bp = require("body-parser");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
// app.use(bp.json());
// app.use(bp.urlencoded({extended: true}));

app.use(cors());

let repositories = [];
let likes = [];

function isIdValido(request, response, next){
    const {id} = request.params;

    if(!isUuid(id)){
      return response.status(400).json({error: "Id inválido."});
    }

    return next();
}

app.use("/repositories/:id", isIdValido);

app.get("/repositories", (request, response) => {
   return response.json(repositories);
});

app.post("/repositories", (request, response) => {

	const {url, title, techs} = request.body;

    const repositorie = {id: uuid(), url: url, title: title, techs: techs, likes: 0}

    repositories.push(repositorie);

    return response.json(repositorie);

});

app.put("/repositories/:id", (request, response) => {
	const {url, title, techs} = request.body;
	const {id}  = request.params;

	const repositoryIndex = repositories.findIndex(repository => repository.id===id);

	const newRepository = {id, url: url, title: title, techs: techs, likes: 0};

	repositories[repositoryIndex] = newRepository;

	return response.json(newRepository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const result = repositories.filter(repository  => repository.id!==id);

  repositories = result;

  return response.status(204).json('No Content');

});

app.post("/repositories/:id/like", (request, response) => {

  const {id} = request.params;

  const like = {id, like: 1 };
  
  likes.push(like);

  repositories.map(repository => {
    if(repository.id===id ){
      repository.likes += 1;
    }
  });

  const qtdLikes = likes.filter(like => like.id===id).length;
  
  return response.status(200).json({likes:qtdLikes});
});

module.exports = app;
