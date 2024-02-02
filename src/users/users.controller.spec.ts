import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: AuthService;
  let fakeUsersService: UsersService;

  beforeEach(async () => {
    // fakeAuthService = {
    //   signUp: () => {},
    //   singIn: () => {}
    // };

    // fakeUsersService = {
    //   findOne: (id: number) => {
    //     return Promise.resolve({id: 999999, email: 'test@gmail.com',password: 'test'} as User);
    //   },
    //   find: (email: string) => {
    //     return Promise.resolve([{id: 999999, email,password: 'test'} as User]);
    //   },
    //   remove: () => {},
    //   update: () => {}
    // };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
