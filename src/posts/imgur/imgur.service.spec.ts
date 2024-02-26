// import { Test, TestingModule } from '@nestjs/testing';
// import { ImgurService } from './imgur.service';
// import { ConfigService } from '@nestjs/config';
// import { HttpService } from '@nestjs/axios';
// import axios from 'axios';
// import { Logger } from '@nestjs/common';
//
// describe('ImgurService', () => {
//   let service: ImgurService;
//   let configService: ConfigService;
//   let httpService: HttpService;
//   let logger: Logger;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ImgurService,
//         {
//           provide: ConfigService,
//           useValue: {
//             get: jest.fn().mockReturnValue('value')
//           }
//         },
//         {
//           provide: HttpService,
//           useValue: {
//             get: jest.fn(),
//             post: jest.fn()
//           }
//         }
//       ]
//     }).compile();
//
//     service = module.get<ImgurService>(ImgurService);
//     configService = module.get<ConfigService>(ConfigService);
//     httpService = module.get<HttpService>(HttpService);
//     logger = module.get<Logger>(Logger);
//   });
//
//   it('should be defined', async () => {
//     const d = await service.getToken();
//     console.log(d);
//     expect(service).toBeDefined();
//   });
//
//   it('should return access token', async () => {
//     const tokenUrl = 'mocked-token-url';
//     const clientId = 'mocked-client-id';
//     const clientSecret = 'mocked-client-secret';
//     const refreshToken = 'mocked-refresh-token';
//     const accessToken = 'mocked-access-token';
//
//     jest.spyOn(configService, 'get').mockImplementation((key: string) => {
//       switch (key) {
//         case 'imgur.tokenUrl':
//           return tokenUrl;
//         case 'imgur.clientId':
//           return clientId;
//         case 'imgur.clientSecret':
//           return clientSecret;
//         case 'imgur.refreshToken':
//           return refreshToken;
//         default:
//           return undefined;
//       }
//     });
//
//     const expectedData = {
//       client_id: clientId,
//       client_secret: clientSecret,
//       refresh_token: refreshToken,
//       grant_type: 'refresh_token'
//     };
//
//     const expectedResponse = { access_token: accessToken };
//
//     jest.spyOn(axios, 'post').mockResolvedValue({ data: expectedResponse });
//
//     const result = await service.getToken();
//
//     expect(result).toBe(accessToken);
//     expect(axios.post).toHaveBeenCalledWith(tokenUrl, expectedData, { responseType: 'json' });
//   });
//
//
// });
