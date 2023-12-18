- [PostgreSQL とは](#postgresql-とは)
  - [色んなデータベース](#色んなデータベース)
    - [RDB](#rdb)
    - [NoSQL](#nosql)
  - [今回やること](#今回やること)
  - [サーバー立ち上げ](#サーバー立ち上げ)
  - [サーバー作成](#サーバー作成)
  - [簡単な API 作成](#簡単な-api-作成)
  - [PostgreSQL でデータベース作成](#postgresql-でデータベース作成)
    - [テーブル作成](#テーブル作成)
    - [SQL 文でデータ挿入](#sql-文でデータ挿入)
    - [サーバーと DB の連携（値の取り出し）](#サーバーと-db-の連携値の取り出し)
  - [DB から値を取得する API を作成](#db-から値を取得する-api-を作成)
  - [特定のユーザー情報を取得する API](#特定のユーザー情報を取得する-api)
  - [クライアント側の操作で**user を追加する API**](#クライアント側の操作でuser-を追加する-api)
  - [user を削除する API](#user-を削除する-api)
  - [user 情報を更新する API](#user-情報を更新する-api)

# PostgreSQL とは

一言で言うと、RDBMS（リレーショナルデータベース管理システム）  
リレーショナル＝関連のある

基本的にテーブルでデータ管理  
同じキーを基に結合が可能

## 色んなデータベース

### RDB

堅牢性が高い

- PostgreSQL
- MySQL
- OracleDB など

### NoSQL

JSON 形式だったり、初心者にはおすすめ

- mongoDB
- Firebase など

## 今回やること

- サーバー立ち上げ：node.js(express)
- クライアント：Postman でリクエスト
- データベース：PostgreSQL

API, SQL を学ぶ

## サーバー立ち上げ

1. server.js 作成
2. `npm init -y`で package.json 初期化
3. `npm i express nodemon pg`で express フレームワークや必要なモジュールをインストール
4. package.json の start の`node`を`nodemon`に変更
5. `npm start`でサーバー立ち上げ完了

## サーバー作成

<small>`server.js`</small>

```javascript
const express = require("express");
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
```

```
[nodemon] restarting due to changes...
[nodemon] starting `node server.js`
Server is running on PORT 3000
```

## 簡単な API 作成

API とは簡単にいうと、クライアントとサーバーを結びつけるもの。  
<small>`server.js`</small>

```diff
const express = require("express");
const app = express();
const PORT = 3000;

+ app.get("/", (req, res) => {
+   res.send("Hello World");
+ });

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
```

PORT3000 にアクセスすると、"Hello World"と出力される。

## PostgreSQL でデータベース作成

SQL Shell で作成  
ひたすら Enter→ パスワード入力まで行い、以下のようになれば OK

```
Server [localhost]:
Database [postgres]:
Port [5432]:
Username [postgres]:
Password for user postgres:
psql (16.1)
Type "help" for help.

postgres=#
```

`\l`（バックスラッシュ＋ l）と入力して Enter すると、今存在しているデータベース一覧が出てくる。

```
postgres=# \l
                                                  List of databases
   Name    |  Owner   | Encoding | Locale Provider | Collate | Ctype | ICU Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+---------+-------+------------+-----------+-----------------------
 postgres  | postgres | UTF8     | libc            | C       | C     |            |           |
 template0 | postgres | UTF8     | libc            | C       | C     |            |           | =c/postgres          +
           |          |          |                 |         |       |            |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | C       | C     |            |           | =c/postgres          +
           |          |          |                 |         |       |            |           | postgres=CTc/postgres
(3 rows)
```

ユーザーのデータベースを作成したいので  
`CREATE DATABASE users;`

そしてまた`\l`すると

```
   Name    |  Owner   | Encoding | Locale Provider | Collate | Ctype | ICU Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+---------+-------+------------+-----------+-----------------------
 postgres  | postgres | UTF8     | libc            | C       | C     |            |           |
 template0 | postgres | UTF8     | libc            | C       | C     |            |           | =c/postgres          +
           |          |          |                 |         |       |            |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | C       | C     |            |           | =c/postgres          +
           |          |          |                 |         |       |            |           | postgres=CTc/postgres
 users     | postgres | UTF8     | libc            | C       | C     |            |           |
(4 rows)
```

一番下に`users`データベースが作成された。

DB の表示が邪魔な場合は、`\! clear`で綺麗になる。

### テーブル作成

`\c users`で、まずは users データベースに移動  
以下のように上から記述していく

```
users=# CREATE TABLE users(
users(# ID serial primary key,
users(# name varchar(255),
users(# email varchar(255),
users(# age int);
CREATE TABLE
```

中身を確認するために`\dt`

```
users=# \dt
         List of relations
 Schema | Name  | Type  |  Owner
--------+-------+-------+----------
 public | users | table | postgres
(1 row)
```

テーブルができたので、次にデータを挿入していくために SQL 文を書いていく。

### SQL 文でデータ挿入

1. `INSERT INTO users (name, email, age)`  
   このフィールドに値を入れていきますよー、って意味。
1. `VALUES`で値を入れる。  
   (シングルクォーテーションじゃないとダメなのと、文末のセミコロンが必要なのも注意)
1. `SELECT * FROM`で出力。（アスタリスクは"全て")

```
users-# INSERT INTO users (name, email age)
users-# VALUES ('pan', 'pan@example.com', 32), ('moki', 'moki@example.com', 26);
INSERT 0 2
users=# SELECT * FROM users;
 id | name |      email       | age
----+------+------------------+-----
  1 | pan  | pan@example.com  |  32
  2 | moki | moki@example.com |  26
(2 rows)
```

### サーバーと DB の連携（値の取り出し）

`pg`と呼ばれるモジュールを使って連携  
連携が終わったらクライアント側から API を叩いて、サーバー側の API が作動 →DB 操作

1. db.js 作成

---

2. コネクションプール用意（いつでも Postgre の DB とアクセスできるように)
   > **コネクションプールとは**  
   > クエリを発行する際、使用するコネクションを保持しておいて使いまわす仕組みのことです。
   >
   > 例えば、DB から値を取ってきて返却する API サーバがあるとします。  
   > 悪い例だと以下のようになります。
   >
   > （1 回目の API）  
   > 　 ➀DB へ接続  
   > 　 ➁SELECT 文とかでデータ取得  
   > 　 ➂ コネクション切断  
   > （2 回目の API）  
   > 　 ➃DB へ接続  
   > 　 ➄SELECT 文とかでデータ取得  
   > 　 ➅ コネクション切断
   >
   > これだと毎回、接続／切断を繰り返しているので、多少なりともオーバーヘッドが生じます。  
   > できれば、最初につないだコネクションを使いまわしたいですよね？
   >
   > そこで登場する仕組みがコネクションプールです。
   > これによって、先ほどの悪い例が以下のように変わります。  
   > （1 回目の API）  
   > 　 ➀DB へ接続  
   > 　 ➁SELECT 文とかでデータ取得  
   > 　 ➂ コネクションをプールに返却  
   > （2 回目の API）  
   > 　 ➃ プールからコネクションをチェックアウト  
   > 　 ➄SELECT 文とかでデータ取得  
   > 　 ➅ コネクションをプールに返却

```javascript
const Pool = require("pg").Pool;

const pool = new Pool({
  // SQL shellで最初に設定したもの
  user: "postgres",
  host: "hocalhost",
  database: "users",
  password: "PASSWORD",
  port: 5432,
});

module.exports = pool;
```

---

## DB から値を取得する API を作成

```javascript
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

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
```

`http://localhost:3000/users`にアクセスするとデータを取得できる。

---

## 特定のユーザー情報を取得する API

```javascript
// 特定のユーザー情報を取得するAPI
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
```

`:id` とすることで動的なエンドポイント設定  
`WHERE id = $1`  
`const id = req.params.id`を`pool.query`の第 2 引数の`[]`の中に入れている。  
`$1`というのは`[]`内の 1 番目ということ。もし`[id, name]`の場合、`$2`とすると`name`を指定することになる。

---

## クライアント側の操作で**user を追加する API**

```javascript
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
```

どうやって追加するのか。ブラウザ側では GET しかできないので、Postman を使ってリクエストを送る。  
使い方は[こちら](https://www.youtube.com/watch?v=SyVw6Vjsf8E)の YouTube 36:00~から

## user を削除する API

```javascript
// ユーザーを削除するAPI
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;
    return res.status(200).send(`ユーザーが削除されました`);
  });
});
```

対象のユーザーが存在するか判定したいので、以前作成した「**特定のユーザー情報を取得する API**」を借りてくる。

```javascript
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
```

## user 情報を更新する API

```javascript
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
```
