const express = require("express");
const app = express();
const port = 3000;
const connection = require("./conf.js");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//GET - Récupération de l'ensemble des données de ta table
app.get("/api/superheros", (req, res) => {
  connection.query("SELECT * from superheros", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

//GET (light) - Récupération de quelques champs spécifiques (id, names, dates, etc...)

app.get("/api/superheros/light", (req, res) => {
  connection.query("SELECT name,cape from superheros", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

//GET - Récupération d'un ensemble de données en fonction de certains filtres
//un filtre contient 'b'
app.get("/api/superheros/filter", (req, res) => {
  connection.query(
    "SELECT name from superheros where name like '%b%'",
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    }
  );
});

//un filtre commence par 'w'
app.get("/api/superheros/filter/1", (req, res) => {
  connection.query(
    "SELECT name from superheros where name like 'w%'",
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    }
  );
});

//un filtre date supérieure à 01 01 2000

app.get("/api/superheros/filter/2", (req, res) => {
  connection.query(
    "SELECT name,birthday from superheros where birthday>20000101",
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    }
  );
});

//GET - Récupération de données ordonnées (ascendant, descendant)L'ordre sera passé en tant que paramètre de la route
app.get("/api/superheros/order", (req, res) => {
  connection.query(
    "SELECT * from superheros order by name DESC",
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    }
  );
});

//POST - Sauvegarde d'une nouvelle entité
app.post("/api/superheros", (req, res) => {
  const formData = req.body;
  connection.query("INSERT INTO superheros SET ?", formData, (err, results) => {
    if (err) {
      res.status(500).send("Error saving");
    } else {
      res.sendStatus(200);
    }
  });
});
//PUT - Modification d'une entité
app.put("/api/superheros/:id", (req, res) => {
  const idSuperheros = req.params.id;
  const formData = req.body;

  connection.query(
    "UPDATE superheros SET ? WHERE id = ?",
    [formData, idSuperheros],
    err => {
      if (err) {
        res.status(500).send("Error editing");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

//PUT - Toggle du booléen
app.put("/api/superheros/capeok/:id", (req, res) => {
  const idSuperheros = req.params.id;
  // const formData = req.body;

  connection.query(
    "UPDATE superheros SET `cape`=NOT`cape` WHERE id = ?",
    [idSuperheros],
    err => {
      if (err) {
        res.status(500).send("Error editing");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

//DELETE - Suppression d'une entité
app.delete("/api/superheros/:id", (req, res) => {
  const idSuperhero = req.params.id;
  connection.query(
    "DELETE FROM superheros WHERE id = ?",
    [idSuperhero],
    err => {
      if (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la suppression");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

//DELETE - Suppression de toutes les entités dont le booléen est false
app.delete("/api/superheros/nocape", (req, res) => {
  connection.query("DELETE FROM superheros WHERE cape=1", err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression");
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, err => {
  if (err) {
    throw new Error("Something bad happened...");
  }

  console.log(`Server is listening on ${port}`);
});
