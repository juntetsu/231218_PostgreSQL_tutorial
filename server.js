const express = require("express");
// db.jsのpoolを使うためにrequireする
const pool = require("./db");
const app = express();
const PORT = 3000;

// ①でJSON形式のデータを扱うための記述
app.use(express.json());

// ユーザー情報を全て取得するAPI
app.get("/users", (req, res) => {
  // ここにデータベースからユーザー情報を取得するSQL文を書く
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows); // ①
  });
});

// 特定のユーザー情報を取得するAPI
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});

// ユーザーを追加するAPI
app.post("/users", (req, res) => {
  // req.bodyにはPOSTで送られてきたJSONデータが入っているので分割代入で取り出す
  const { name, email, age } = req.body;

  // ユーザーがすでに存在するかどうかをチェックする
  pool.query(
    "SELECT s FROM users s WHERE s.email = $1",
    [email],
    (error, results) => {
      if (results.rows.length) {
        return res.send("ユーザーがすでに存在します");
      }

      // ユーザーが存在しない場合はユーザーを追加する
      pool.query(
        "INSERT INTO users (name, email, age) VALUES ($1, $2, $3)",
        [name, email, age],
        (error, results) => {
          if (error) throw error;
          return res.status(201).send("ユーザーが追加されました");
        }
      );
    }
  );
});

// ユーザーを削除するAPI
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  // ユーザーが存在するかどうかをチェックする
  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;

    // ユーザーが存在しない場合はエラーを返す
    const isUserExist = results.rows.length;
    if (!isUserExist) {
      return res.send("ユーザーが存在しません");
    }

    // ユーザーが存在する場合はユーザーを削除する
    pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
      if (error) throw error;
      return res.status(200).send(`ユーザーが削除されました`);
    });
  });
});

// ユーザー情報を更新するAPI
app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, age } = req.body;

  // ユーザーが存在するかどうかをチェックする
  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;

    // ユーザーが存在しない場合はエラーを返す
    const isUserExist = results.rows.length;
    if (!isUserExist) {
      return res.send("ユーザーが存在しません");
    }

    // ユーザーが存在する場合はユーザー情報を更新する
    pool.query(
      "UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4",
      [name, email, age, id],
      (error, results) => {
        if (error) throw error;
        return res.status(200).send(`ユーザー情報が更新されました`);
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
