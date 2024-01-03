

export const generatePaginationNumbers = ( currentPage: number, totalPage: number ) => {
    // si el numero total de pagina es 7 o menos
    if( totalPage <= 7 ) {
        return Array.from({ length: totalPage }, (_, i) => i + 1);
    }

    // si la pagina actual esta entre las primeras 3 paginas
    if( currentPage <= 3 ) {
        return [1,2,3,'...', totalPage -1, totalPage];
    }

    // Si la pagina actual esta entre las 3 ultimas
    if( currentPage >= totalPage -2 ) {
        return [1,2,'...', totalPage -2, totalPage -1, totalPage];
    }

    // Si la pagina actual esta en otro lugar memedio
    return [1,'...', currentPage -1, currentPage, currentPage +1, '...', totalPage];

}