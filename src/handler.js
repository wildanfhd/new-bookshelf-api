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
  // Membuat variabel yang berisi id, name, dan publisher dari buku pada array books
  const listOfBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  // Jika panjang dari array sama dengan nol, maka server akan mengembalikan data berupa array books kosong
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

  // Jika tidak masuk ke dalam pengkondisian (books.length === 0), maka server akan mengembalikan data yaitu listOfBooks yang berupa object yang berisi id, name, dan publisher dari masing-masing buku yang ada.
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

  if (!book) {
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

const editBookByIdHandler = (request, h) => {
  // Mendapatkan nilai bookId untuk menyesuaikan id buku dengan id yang ada di route parameter
  const { bookId } = request.params;

  // Mengambil data books terbaru yang dikirimkan oleh client melalui request.payload
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

  // Mengecek apakah book memiliki properti name atau tidak
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // Mengecek apakah halaman yang dibaca lebih banyak (lebih besar) dari halaman total
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  // Mendapatkan index array pada objek catatan sesuai id yang ditentukan.
  // jika note dengan id yang dicari ditemukan,
  // maka index akan bernilai array index dari objek catatan yang dicari
  // , jika tidak maka index = -1
  const index = books.findIndex((buku) => buku.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  // Jika id tidak ditemukan maka server akan mengembalikan error 404
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  saveBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
};
