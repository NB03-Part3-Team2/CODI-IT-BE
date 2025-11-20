import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CODI-IT API',
    version: '1.0.0',
    description: 'CODI-IT 고급프로젝트 2조 백엔드 API 문서',
    contact: {
      name: 'CODI-IT Team',
      url: 'https://github.com/NB03-Part3-Team2/CODI-IT-BE',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '로컬 개발 서버',
    },
    {
      url: process.env.BACKEND_BASE_URL || 'https://api.codi-it.com',
      description: '프로덕션 서버',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT 액세스 토큰을 입력하세요',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
        description: '리프레시 토큰 (자동으로 쿠키에 설정됨)',
      },
    },
    responses: {
      UnauthorizedError: {
        description: '인증 실패',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: { type: 'number', example: 401 },
                message: { type: 'string', example: '인증이 필요합니다' },
              },
            },
          },
        },
      },
      ForbiddenError: {
        description: '권한 없음',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: { type: 'number', example: 403 },
                message: { type: 'string', example: '접근 권한이 없습니다' },
              },
            },
          },
        },
      },
      NotFoundError: {
        description: '리소스를 찾을 수 없음',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: '요청한 리소스를 찾을 수 없습니다' },
              },
            },
          },
        },
      },
      ValidationError: {
        description: '입력 데이터 검증 실패 (Zod Validation Error)',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: { type: 'number', example: 400 },
                status: { type: 'number', example: 400 },
                message: {
                  type: 'string',
                  example:
                    '사용자 로그인 유효성 검사 실패: email: 유효한 이메일 주소가 아닙니다., password: 비밀번호는 최소 8자 이상이어야 합니다',
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      path: {
                        type: 'string',
                        example: 'email',
                        description: '에러가 발생한 필드 경로',
                      },
                      message: {
                        type: 'string',
                        example: '유효한 이메일 주소가 아닙니다.',
                        description: '필드별 상세 에러 메시지',
                      },
                    },
                  },
                  example: [
                    {
                      path: 'email',
                      message: '유효한 이메일 주소가 아닙니다.',
                    },
                    {
                      path: 'password',
                      message: '비밀번호는 최소 8자 이상이어야 합니다',
                    },
                  ],
                },
              },
            },
            examples: {
              loginError: {
                summary: '로그인 유효성 검사 실패',
                value: {
                  code: 400,
                  status: 400,
                  message:
                    '사용자 로그인 유효성 검사 실패: email: 유효한 이메일 주소가 아닙니다., password: 비밀번호는 최소 8자 이상이어야 합니다',
                  details: [
                    { path: 'email', message: '유효한 이메일 주소가 아닙니다.' },
                    { path: 'password', message: '비밀번호는 최소 8자 이상이어야 합니다' },
                  ],
                },
              },
              createUserError: {
                summary: '회원가입 유효성 검사 실패',
                value: {
                  code: 400,
                  status: 400,
                  message:
                    '회원가입 유효성 검사 실패: name: 닉네임은 최소 2자 이상이어야 합니다, email: 유효한 이메일 주소가 아닙니다.',
                  details: [
                    { path: 'name', message: '닉네임은 최소 2자 이상이어야 합니다' },
                    { path: 'email', message: '유효한 이메일 주소가 아닙니다.' },
                  ],
                },
              },
              createProductError: {
                summary: '상품 생성 유효성 검사 실패',
                value: {
                  code: 400,
                  status: 400,
                  message:
                    '상품 생성 유효성 검사 실패: name: 상품 이름은 최소 2자 이상이어야 합니다, price: 가격은 0 이상이어야 합니다.',
                  details: [
                    { path: 'name', message: '상품 이름은 최소 2자 이상이어야 합니다' },
                    { path: 'price', message: '가격은 0 이상이어야 합니다.' },
                  ],
                },
              },
              createOrderError: {
                summary: '주문 생성 유효성 검사 실패',
                value: {
                  code: 400,
                  status: 400,
                  message:
                    '주문 생성 유효성 검사 실패: orderItems: 최소 하나의 주문 아이템이 필요합니다., address: 주소는 필수입니다.',
                  details: [
                    { path: 'orderItems', message: '최소 하나의 주문 아이템이 필요합니다.' },
                    { path: 'address', message: '주소는 필수입니다.' },
                  ],
                },
              },
              createReviewError: {
                summary: '리뷰 작성 유효성 검사 실패',
                value: {
                  code: 400,
                  status: 400,
                  message:
                    '리뷰 작성 유효성 검사 실패: rating: 평점은 1에서 5 사이여야 합니다., content: 리뷰는 최소 10자 이상이어야 합니다',
                  details: [
                    { path: 'rating', message: '평점은 1에서 5 사이여야 합니다.' },
                    { path: 'content', message: '리뷰는 최소 10자 이상이어야 합니다' },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [
    './src/modules/**/productSwagger.ts',
    './src/modules/**/authSwagger.ts',
    './src/modules/**/cartSwagger.ts',
    './src/modules/**/dashboardSwagger.ts',
    './src/modules/**/inquirySwagger.ts',
    './src/modules/**/metadataSwagger.ts',
    './src/modules/**/notificationSwagger.ts',
    './src/modules/**/orderSwagger.ts',
    './src/modules/**/reviewSwagger.ts',
    './src/modules/**/s3Swagger.ts',
    './src/modules/**/storeSwagger.ts',
    './src/modules/**/userSwagger.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI 페이지
  app.use(
    '/api-docs-team2-a7f3c8e9',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'CODI-IT API 문서',
    }),
  );

  // Swagger JSON
  app.get('/api-docs-team2-a7f3c8e9.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
