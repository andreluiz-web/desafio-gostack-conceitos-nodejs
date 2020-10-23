const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

function ValidadeRepositoryId(req, res, next) {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({ error: 'Invalid Repository Id' })
    }

    return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", ValidadeRepositoryId, (request, response) => {

      const { id } = request.params; 
      const { title, url, techs } = request.body;

      const findedId = repositories.findIndex(item => item.id === id);

      const updatedRepository = {
        id,
        title,
        url,
        techs,
        likes: repositories[findedId].likes,
      }

      repositories[findedId] = updatedRepository;

      return response.json(updatedRepository);
});

app.delete("/repositories/:id", ValidadeRepositoryId, (request, response) => {

  const { id } = request.params; 
  const findedId = repositories.findIndex(item => item.id === id);

  repositories.splice(findedId);
  return response.status(204).send();

});

app.post("/repositories/:id/like", ValidadeRepositoryId, (request, response) => {

      const { id } = request.params;
      const findedId = repositories.findIndex(item => item.id === id);

      repositories[findedId].likes += 1;

      return response.json(repositories[findedId]);

});

module.exports = app;
