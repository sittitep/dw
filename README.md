## Requirements
- node v20.15.0
- ruby 3.3.0

## Installation
### Backend
- bundle install
- rake db:create
- rake db:migrate
- rake db:seed
- rails s

### Frontend
- yarn install
- yarn start

If you set it up correctly, you should be able to see this screen at http://localhost:3001. For the demo, username is `admin` and password is `password`

<img width="935" alt="Screenshot 2567-07-13 at 17 37 02" src="https://github.com/user-attachments/assets/c842f008-305a-463f-851d-5500f92c05c8">

## Other security or enhancement
Due to the time constraints, I was not add many enhancements, but here is the list of things that I would like to add:
- Migrate from Grape to Pure Rails API. Grape has it time when Rails was young and didn't have a good API support, but now Rails has a good API support and Grape is not necessary anymore.
- Add role based authentication, so we can have different roles with different permissions.
- Add idempotency to the API, so we can avoid duplicated requests.
- Enhance token using jwt, so we can have a more secure token.
