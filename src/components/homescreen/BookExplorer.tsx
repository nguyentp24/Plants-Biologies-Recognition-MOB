// src/components/BookExplorer.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Lesson {
  lesson_Id: string;
  lesson_Title: string;
}

interface Chapter {
  chapter_Id: string;
  chapter_Title: string;
  lessons: Lesson[];
}

interface Book {
  book_Id: string;
  book_Title: string;
  cover_img: string;
  chapters: Chapter[];
}

const BookExplorer: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Book[]>('http://localhost:5000/api/Book/search') // 🔁 Đổi URL nếu cần
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Lỗi khi tải dữ liệu sách.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>📚 Danh sách sách</h2>
      <ul>
        {books.map(book => (
          <li key={book.book_Id} style={{ marginBottom: 10 }}>
            <button onClick={() => setExpandedBookId(expandedBookId === book.book_Id ? null : book.book_Id)}>
              {expandedBookId === book.book_Id ? '▼' : '▶'} {book.book_Title}
            </button>

            {expandedBookId === book.book_Id && (
              <ul style={{ marginLeft: 20 }}>
                {book.chapters.map(ch => (
                  <li key={ch.chapter_Id}>
                    <button onClick={() => setExpandedChapterId(expandedChapterId === ch.chapter_Id ? null : ch.chapter_Id)}>
                      {expandedChapterId === ch.chapter_Id ? '📂' : '📁'} {ch.chapter_Title}
                    </button>

                    {expandedChapterId === ch.chapter_Id && (
                      <ul style={{ marginLeft: 20 }}>
                        {ch.lessons.map(lesson => (
                          <li key={lesson.lesson_Id}>📖 {lesson.lesson_Title}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookExplorer;
