# Runbook — how to bring this up and capture real grading evidence

I generated all the code. You need to actually run it (I have no internet access in
my sandbox) so that every terminal output / screenshot you submit is genuine. Follow
this in order.

## 0. Prerequisites (on your own machine or the IBM Skills Network lab)
- Docker + Docker Compose
- Node.js 18+ (only if you want to run the frontend dev server separately)
- Python 3.11
- Git + a GitHub account

## 1. Get the code into a Git repo
```bash
cd cars-dealership
git init
git add .
git commit -m "Initial capstone scaffold"
gh repo create cars-dealership --public --source=. --push
# or: create an empty repo on github.com, then
#   git remote add origin https://github.com/<you>/cars-dealership.git
#   git branch -M main && git push -u origin main
```
**Task 1** = the public URL of `README.md` in that repo, e.g.
`https://github.com/<you>/cars-dealership/blob/main/README.md`

## 2. Bring up all four services
```bash
docker compose up --build
```
This starts: MongoDB, the Node/Express dealer+review service (port 3030), the Flask
sentiment analyzer (port 5050), and the Django app (port 8000).

**Task 2**: in a separate terminal, run:
```bash
docker compose logs server > django_server.txt
```
Open `django_server.txt`, confirm it shows Django's "Watching for file changes..." /
"Starting development server at http://0.0.0.0:8000/" (or gunicorn boot log), and
paste that into a file named exactly `django_server` for submission.

## 3. Build the React frontend (for the home page / Register / Login screens)
```bash
cd server/frontend
npm install
npm run build      # outputs bundle to server/frontend/static/djangoapp/js
```
Then restart the `server` container (or rerun collectstatic) so Django serves the
fresh bundle.

## 4. Django admin + migrations (Tasks 12, 13, 14, 15)
```bash
docker compose exec server python manage.py migrate
docker compose exec server python manage.py createsuperuser
```
- Visit `http://localhost:8000/admin/`, log in as the superuser you just created →
  screenshot as `admin_login.png`.
- Log out of admin → screenshot as `admin_logout.png`.
- Add a couple of CarMake/CarModel entries in the admin, or just hit `/djangoapp/get_cars`
  which auto-seeds three makes if the table is empty.

## 5. cURL commands — run these for real and save output exactly as named

**Task 5 — login** (save to a file named `loginuser`):
```bash
curl -i -X POST http://localhost:8000/djangoapp/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"testuser","password":"testpass123"}' \
  -c cookies.txt | tee loginuser
```
(Register `testuser` first via the `/register/` page or the `/djangoapp/register`
endpoint if it doesn't exist yet.)

**Task 6 — logout** (save to `logoutuser`):
```bash
curl -i -X GET http://localhost:8000/djangoapp/logout -b cookies.txt | tee logoutuser
```

**Task 8 — dealer reviews by dealer ID** (save to `getdealerreviews`):
```bash
curl -i http://localhost:8000/djangoapp/get_dealer_reviews/1 | tee getdealerreviews
```

**Task 9 — all dealers** (save to `getalldealers`):
```bash
curl -i http://localhost:8000/djangoapp/get_dealers | tee getalldealers
```

**Task 10 — dealer by ID** (save to `getdealerbyid`):
```bash
curl -i http://localhost:8000/djangoapp/get_dealer/1 | tee getdealerbyid
```

**Task 11 — dealers by state (Kansas)** (save to `getdealersbyState`):
```bash
curl -i http://localhost:8000/djangoapp/get_dealers/Kansas | tee getdealersbyState
```
(The seed data in `database/data/dealerships.json` already includes two Kansas dealers.)

**Tasks 14/15 — all car makes and models** (save to `getallcarmakes`):
```bash
curl -i http://localhost:8000/djangoapp/get_cars | tee getallcarmakes
```

**Task 16 — sentiment analysis** (save to `analyzereview`):
```bash
curl -i "http://localhost:5050/analyze/Fantastic%20services" | tee analyzereview
```

## 6. Browser screenshots (Tasks 17–22)
1. `get_dealers.png` — open `http://localhost:8000/` **before** logging in.
2. Log in via the Login page.
3. `get_dealers_loggedin.png` — home page **after** login: must show your
   username, the "Review Dealer" links, and the URL bar visible.
4. Filter by a state, e.g. Kansas → `dealersbystate.png`, URL bar visible
   (`/djangoapp/get_dealers/Kansas` reflected in your app's state, or navigate to
   a route that shows it — make sure the address bar is in frame).
5. Click into a dealer → `dealer_id_reviews.png`, address bar showing `/dealer/<id>`.
6. Click "Review Dealer", fill the form, **before** submitting →
   `dealership_review_submission.png`.
7. Submit → land back on the dealer page showing the new review →
   `added_review.png`.

## 7. CI/CD (Task 23)
Push to GitHub — the workflow in `.github/workflows/django-app.yml` runs automatically.
Go to the **Actions** tab, open the successful run, expand each step, and save the
full log (Actions → run → "..." menu → "View raw logs", or just copy the step output)
into a file named `CICD`.

## 8. Deployment (Tasks 24–28)
Pick one path:

**Option A — IBM Cloud Code Engine**
```bash
ibmcloud login
ibmcloud target -g <resource-group>
ibmcloud ce project create --name cars-dealership
ibmcloud ce project select --name cars-dealership

# build & push each image to IBM Container Registry, then:
ibmcloud ce application create --name django-app \
  --image us.icr.io/<namespace>/cars-dealership-django:latest \
  --env BACKEND_URL=<node-service-url> \
  --env SENTIMENT_ANALYZER_URL=<flask-service-url> \
  --port 8000 --min-scale 1
```
Repeat `ibmcloud ce application create` for the Node dealer/review service and the
Flask sentiment service, and use `ibmcloud ce application create --image ... mongo`
or an external managed MongoDB.

**Option B — any Kubernetes cluster**
```bash
kubectl apply -f k8s/django-deployment.yaml
kubectl get services   # grab the external/LoadBalancer URL
```

Once you have a public URL:
- Save it in a plain text file named `deploymentURL`.
- `deployed_landingpage.png` — the deployed home page.
- `deployed_loggedin.png` — logged in, username visible.
- `deployed_dealer_detail.png` — a dealer detail page on the deployed URL.
- `deployed_add_review.png` — a review shown on the deployed URL.

---
Ping me with the specific step you get stuck on (an error message, a failing cURL
response, a build log) and I'll debug it with you directly.
