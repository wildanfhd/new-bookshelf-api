const { nanoid } = require("nanoid");
const books = require("./books");

const saveBookHandler = (request, h) => {
  // Mendapatkan body request dari buku dengan request.payload
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  // Mengecek apakah client melampirkan properti name pada request body atau tidak
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // Mengecek apakah readPage(halaman yang sudah dibaca) lebih besar dari pageCount(jumlah halaman yang ada) atau tidak.
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  // newBook akan menampung seluruh objek buku
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Menambahkan newBook yang berisi properti buku ke dalam array book
  books.push(newBook);

  // Membuat indikator bahwa id yang ada pada array books itu sama dengan id yang sudah dibuat dengan nanoid
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const listOfBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  if (books.length === 0) {
    const response = h.response({
      status: "success",
      data: {
        books: [],
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      books: listOfBooks,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((buku) => buku.id === bookId)[0];

  if (book === undefined) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};
module.exports = { saveBookHandler, getAllBooksHandler, getBookByIdHandler };
