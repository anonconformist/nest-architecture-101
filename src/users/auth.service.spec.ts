import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthSercvice', () => {
    let service: AuthService;
    let fakeUserService: Partial<UsersService>;

    beforeEach(async () => {
        //fake copy of userService 
        const users : User[] = [];
        fakeUserService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {id:Math.floor(Math.random() * 999999), email, password} as User;
                users.push(user);
                return Promise.resolve(user);
            }
        }
        const module = await Test.createTestingModule({
            providers: [AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService
                }
            ],
        }).compile();

        service = module.get(AuthService);
    })

    it('can create an instance of auth service', async () => {

        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signUp('unittesting@gmail.com','testpwd');

        expect(user.password).not.toEqual('testpwd');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws if user is already signed in', async () => {
        fakeUserService.find = () => Promise.resolve([{id: 1, email: 'a', password: 'b'} as User]);
        Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
    })

    it('throws if signin is called with an unused email', async () => {
        await expect(
          service.signIn('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
    });
    
    it('throws if an invalid password is provided', async () => {
        // fakeUserService.find = () =>
        //   Promise.resolve([
        //     { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
        //   ]);
        await service.signUp('laskdjf@alskdfj.com','password134')
        await expect(
          service.signIn('laskdjf@alskdfj.com', 'password'),
        ).rejects.toThrow(BadRequestException);
      });
})