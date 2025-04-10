import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
  ) {}

  async getManyMovies(title?: string) {
    if (!title) {
      return {
        data: await this.movieRepository.find({
          relations: ['detail'],
        }),
        cnt: await this.movieRepository.count(),
      };
    }

    const movies = await this.movieRepository.find({
      where: {
        title: ILike(`%${title}%`),
      },
      relations: ['detail'],
    });

    return { data: movies, cnt: movies.length };
  }

  async getMovieById(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
    }

    return movie;
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    const movieDetail = await this.movieDetailRepository.save({
      detail: createMovieDto.detail,
    });

    const movie = await this.movieRepository.save({
      title: createMovieDto.title,
      genre: createMovieDto.genre,
      detail: movieDetail,
    });

    return movie;
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
    }

    await this.movieRepository.update({ id }, updateMovieDto);

    const newMovie = await this.movieRepository.findOne({
      where: { id },
    });

    return newMovie;
  }

  async deleteMovie(id: number) {
    const result = await this.movieRepository.delete(id);

    if (result.affected === 0)
      throw new NotFoundException('존재하지 않는 ID의 영화입니다.');

    return id;
  }
}
