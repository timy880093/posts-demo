# 小工具：產生圖片縮網址

## Description
* api:
    * getAllPosts：取得所有 posts
    * uploadImgur：上傳圖片到 imgur
* schedule：
    * 每分鐘執行一次，每次去 db 查 IDLE 狀態的 post，並加入 queue
* queue：
    * 每次執行前先 delay 30 秒，避免 429 發生
    * 任務執行完後，更新 db 的 post 狀態為 DONE
    * 任務執行失敗，更新 db 的 post 狀態為 ERROR


## Installation
`npm install`

## Usage
### Prepare

* install docker
* install docker-compose
* register imgur account, and get token
    1. 註冊 Imgur，取得 album_id，請參照 https://www.digitbin.com/how-to-create-an-album-on-imgur/
    2. 註冊 Imgur app 服務，取得以下資訊，請參照 https://tools.wingzero.tw/article/sn/1327
        * client_id
        * client_secret
        * refresh_token
    3. 將以上資訊填入 `.env` 檔案
    4.
* create `.env` file
    ```
    PORT=app port
    DATABASE_FILE=json file name
    DATABASE_NAME=posts
    
    IMGUR_TOKEN_URL=https://api.imgur.com/oauth2/token
    IMGUR_CLIENT_ID=7cd2c86728bbcc2
    IMGUR_CLIENT_SECRET=d72573168c2083e1ee89a582f66c65de41b90a2c
    IMGUR_REFRESH_TOKEN=5e499f00e54bbf4911f9f41741acc71be58a9969
    IMGUR_ALBUM_ID=ilBSdia
  ```

### Start on Docker
`docker compose up -d`


### Start on Local
`npm run dev`


## Reference

* [create imgur album](https://www.digitbin.com/how-to-create-an-album-on-imgur/)
* [register imgur app token](https://tools.wingzero.tw/article/sn/1327)
* [queue producer & consumer](https://github.com/nestjs/nest/tree/master/sample/26-queues)
