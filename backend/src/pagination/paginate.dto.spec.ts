import { PaginationDto } from './paginate.dto';

describe('PaginateDtoTs', () => {
  it('should be defined', () => {
    expect(new PaginationDto()).toBeDefined();
  });
});