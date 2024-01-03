const Recommend = ({ booksResult, userResult }) => {
    if (booksResult.loading || userResult.loading) {
        return <div>loading...</div>
    }
    console.log(userResult)
    const books = booksResult.data.allBooks
    const user = userResult.data.me


    if (!user) {
        return null
    }


    const genre = user.favoriteGenre
    return (
        <div>
        <h2>recommendations</h2>
        <p>books in your favorite genre <b>{genre}</b></p>
        <table>
            <tbody>
            <tr>
                <th></th>
                <th>
                author
                </th>
                <th>
                published
                </th>
            </tr>
            {books.filter(book => book.genres.includes(genre)).map(book => <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
                </tr>)}
            </tbody>
        </table>
        </div>
    )
}

export default Recommend