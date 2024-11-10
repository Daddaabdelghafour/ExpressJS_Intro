import express from "express";
import path, { parse } from "path";
import { fileURLToPath } from "url";
import { query, validationResult, body } from "express-validator";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const mockusers = [
  {
    id: 1,
    name: "abdelghafour",
    displayname: "the honored one",
  },
  {
    id: 2,
    name: "hiba",
    displayname: "The Cat",
  },
  {
    id: 3,
    name: "hiraya",
    displayname: "Nemesis",
  },
  {
    id: 4,
    name: "Laura",
    displayname: "The Spy",
  },
  {
    id: 5,
    name: "Sen Tenz",
    displayname: "The Valo Champ",
  },
  {
    id: 6,
    name: "Ronin",
    displayname: "The leiwin",
  },
];

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "/index.html"));
  //response.send({ msg: "Hello! abdou" });
  // response.status(404).send("Sorry can't find that");
});

app.get("/api/users", query("filter").notEmpty(), (request, response) => {
  const result = validationResult(request);
  if (result.isEmpty()) {
    const {
      query: { filter, value },
    } = request;
    if (!filter && !value) return response.send(mockusers);

    if (filter && value)
      return response.send(
        mockusers.filter((user) => {
          return user[filter].includes(value);
        })
      );

    response.send(mockusers);
  } else {
    response.send({ errors: result.array() });
  }
});

app.get("/api/users/:id", (request, response) => {
  const parsedId = parseInt(request.params.id);
  if (isNaN(parsedId)) {
    return response
      .status(400)
      .send("Invalid request buddy , check the ID passed");
  }
  const findUser = mockusers.find((user) => {
    return user.id === parsedId;
  });
  if (!findUser) {
    response.sendStatus(404);
  } else {
    response.send(findUser);
  }
});

app.get("/api/products", (request, response) => {
  response.send([
    {
      id: 1,
      name: "chicken Breast",
      price: 12.99,
    },
  ]);
});

app.post(
  "/api/users",
  body("name")
    .notEmpty()
    .withMessage("Please give a value for name")
    .isLength({ min: 5, max: 32 })
    .withMessage("Length between 5 and 32 characters"),
  (request, response) => {
    const result = validationResult(request);
    if (result.isEmpty()) {
      const { body } = request;
      const newUser = {
        id: mockusers[mockusers.length - 1].id + 1,
        ...body,
      };
      mockusers.push(newUser);
      return response.status(201).send(newUser);
    }
    response.send({ errors: result.array() });
  }
);

app.put("/api/users/:id", (request, response) => {
  const {
    params: { id },
    body,
  } = request;
  const parsedid = parseInt(id);
  if (isNaN(parsedid)) {
    return response.sendStatus(400);
  }

  const finduserindex = mockusers.findIndex((user) => {
    return user.id === parsedid;
  });
  console.log(finduserindex);

  if (finduserindex == -1) {
    return response.sendStatus(404);
  }

  mockusers[finduserindex] = {
    id: parsedid,
    ...body,
  };
  console.log(mockusers[2]);
  return response.send(200);
});

app.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return response.sendStatus(401);
  }

  const userIndex = mockusers.findIndex((user) => {
    return user.id === parsedId;
  });
  if (userIndex == -1) {
    return response.sendStatus(401);
  }

  mockusers[userIndex] = {
    ...mockusers[userIndex],
    ...body,
  };
  return response.sendStatus(200);
});

app.delete("/api/users/:id", (request, response) => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return response.sendStatus(401);
  }

  const finduserindex = mockusers.findIndex((user) => {
    return user.id === parsedId;
  });

  if (finduserindex == -1) {
    return response.sendStatus(400);
  }
  mockusers.splice(finduserindex, 1);
  return response.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
