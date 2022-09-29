#

## 프로젝트 설명⚡️

<pre>
sns 서비스로 로그인 한 사용자는 간단한 글을 작성할 수 있고 접근성을 위해 작성한 글은 비로그인 유저를 포함한 모두가 조회할 수 있도록 하였습니다.
pagination, 정렬, 검색 기능을 추가하여 사용자의 편의에 맞게 게시글 목록을 조회 할 수 있습니다.
</pre>

</br>

## 프로젝트 요약🌈

- 기간 : 2022.09.22 ~ 09.28
- 개발 언어 : Typescript
- 개발 프레임워크 : NestJs
- DB : MySQL

</br>

## 프로젝트 설정

</br>

## ERD✨

<details>
<summary>ERD</summary>
<img width="500" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/980b2168-bfbc-4a89-8d23-e1b045d3cd4d/image.png">
</details>

</br>

## API 명세✨

[api 명세](https://www.notion.so/2dcd93256cea470cbd64d2d1aac58f9c?v=6bb97da0351947c4862cd312e653a1ea)
</br></br>

## 요구사항 분석🌟

1. 유저
   - 회원가입
     - 아이디는 email 사용
     - 비밀번호 암호화
     - username unique 설정
   - 로그인
     - JWT 토큰을 발급 받아 사용자 인증 처리
     - token expire 고려
   - 로그아웃
     - 프론트 엔드 처리
2. 게시글
   - 게시글 작성
     - 제목, 내용, 해시태그 필요
       - 해시태그는 “#여행,#행복” 형식으로 입력
       - 작성자는 token에서 얻은 사용자 정보 이용
   - 게시글 수정
     - 작성자만 수정 가능
   - 게시글 삭제
     - 작성자만 삭제 가능
     - 작성자는 삭제된 게시글 복구 가능(softdelete)
   - 게시글 상세 조회
     - 모든 사용자 이용 가능
     - 모든 이용자는 좋아요 클릭 가능
       - 다시 클릭시 좋아요 취소
     - 게시글 상세보기 할 경우 조회수 1 증가
       - 횟수 제한 없음
   - 게시글 목록
     - 모든 이용자 이용 가능
     - 제목, 작성자, 해시태그, 작성일, 좋아요 수, 조회수 포함
     - 정렬
       - default: 작성일 DESC
       - 작성일, 좋아요 수, 조회 수 중 선택 가능
     - 검색
       - 검색어가 포함된 모든 게시물 검색
     - 필터링
       - 해시태그를 포함한 게시물 필터링
       - ‘,’ 를 사용하여 and 연산 실행 가능
     - 페이지
       - 1 페이지 당 게시글 수 조정 가능(default: 10)

</br>

## 테스트 코드

<details>
<summary>userService</summary>
<img width="300" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/8a021ac1-5c26-43c8-8808-435a96789fde/image.png">
</details>

<details>
<summary>boardService</summary>
<img width="300" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/fd1b0909-4ecc-4d1b-9589-8acefe820060/image.png">
</details>

<details>
<summary>tagService</summary>
<img width="300" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/8c9013eb-80d6-471f-b572-cd6ebfe0e158/image.png">
</details>

<details>
<summary>thumbService</summary>
<img width="300" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/07d0fd02-e17f-4345-bfee-5ac34485aed2/image.png">
</details>

<details>
<summary>test coverage</summary>
<img width="800" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/51219225-a535-4d47-81b3-5d8aaf9c1ea6/image.png">
</details>

</br>

## 트러블 슈팅🚀

### 1. 순환 의존성(Circular Dependency) 문제

- 문제 상황
  - boardService와 thumbService를 DI 하는 중 DI 인식을 하지 않는 문제 발생
- 원인
  - nestjs 에서는 모듈 2개가 서로 import 하게 되면 순환 의존성 문제 발생
- 해결 방안
  - forwardRef(() ⇒ import할 모듈 이름) 을 사용해 방향을 지정하여 해결
  ```typescript
  imports: [
      TypeOrmModule.forFeature([Board]),
      forwardRef(() => TagModule),
      forwardRef(() => ThumbModule),
    ],
  ```

### 2. QueryFailedError: Duplicate entry '' for key 'user.IDX_da5934070b5f2726ebfd3122c8’

- 문제 상황
  - entity의 type 및 조건을 설정하고 yarn start 시 위의 오류 발생
- 원인
  - 조건을 지정한 몇 개의 컬럼에서 값이 ‘’으로 변경되어 unique 제약 조건 위반
- 해결 방안
  - DB table을 초기화 하여 해결
- 배운점
  - entity의 설정을 미리 생각하여 프로젝트 세팅시 설정하고 가능한 변경사항이 없도록 하는 것이 좋을 것 같다.

</br>

## 사용한 라이브러리(패키지)

</br>

| 라이브러리명    | 내용                          | 참고                                         |
| --------------- | ----------------------------- | -------------------------------------------- |
| typeorm         | ORM                           |                                              |
| jest            | 테스트                        | service layer unit test 진행                 |
| bcrypt          | 비밀번호 암호화               | 회원가입 및 로그인 시 사용                   |
| jwt             | 사용자 인증 토큰 발급         | 로그인에 성공한 사용자에게 access token 발급 |
| passport        | 토큰 유효성 검사              | validate를 사용하여 토큰의 유효성 검사       |
| class-validator | dto 및 param 등의 유효성 검사 |                                              |
| swagger         | api 문서화                    |                                              |
