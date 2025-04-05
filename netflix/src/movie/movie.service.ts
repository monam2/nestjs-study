import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

export interface Movie {
  id: number;
  title: string;
  genre: string;
}

@Injectable()
export class MovieService {
  private movies: Movie[] = [
    {
      id: 1,
      title: '해리포터',
      genre: '판타지',
    },
    {
      id: 2,
      title: '반지의 제왕',
      genre: '판타지',
    },
  ];
  private idCounter = 3;

  getManyMovies(title?: string) {
    if (!title) {
      return this.movies;
    }

    return this.movies.filter((m) => m.title === title);
  }

  getMovieById(id: number) {
    const movie = this.movies.find((m) => m.id === +id);

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
    }

    return movie;
  }

  createMovie(createMovieDto: CreateMovieDto) {
    const movie: Movie = {
      id: this.idCounter++,
      ...createMovieDto,
    };

    this.movies.push(movie);
    return movie;
  }

  updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = this.movies.find((m) => m.id === +id);

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
    }

    Object.assign(movie, updateMovieDto);
    return movie;
  }

  deleteMovie(id: number) {
    const movieIdx = this.movies.findIndex((m) => m.id === +id);

    if (movieIdx === -1) {
      throw new NotFoundException('존재하는 ID의 영화가 없습니다.');
    }

    this.movies.splice(movieIdx, 1);
    return id;
  }
}
