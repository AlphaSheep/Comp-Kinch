 # Comp Kinch

A website that displays KinchRank-like ranking for WCA competitions.

### Run Production Build

Run a production server in a docker container. First create an image
```
docker build . -t comp-kinch
```
Then run the container
```
docker run -p 3000:3000 comp-kinch
``` 
By default the production version is available on port 3000, but this can be changed as necessary.


### Run Development Server

Run a development server
```
npm run start
```
You can access the app in your browser at `http://localhost:1234`

Tests can be run with
```
npm run test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

