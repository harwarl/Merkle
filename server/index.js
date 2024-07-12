const express = require("express");
const niceList = require("../utils/niceList.json");
const verifyProof = require("../utils/verifyProof");
const MerkleTree = require("../utils/MerkleTree");

const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
const merkleTree = new MerkleTree(niceList);

// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = merkleTree.getRoot();

app.post("/gift", (req, res) => {
  // grab the parameters from the front-end here
  const body = req.body;

  // TODO: prove that a name is in the list
  // Get the index of the name on the list
  const index = niceList.findIndex((n) => n === body.name);
  // Get proof that the name is on the list
  const proof = merkleTree.getProof(index);

  const isInTheList = verifyProof(proof, body.name, MERKLE_ROOT);

  if (isInTheList) {
    res.send("You got a toy robot!");
  } else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
