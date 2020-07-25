from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core import serializers
from .models import User, Post


def index(request):
    return render(request, "network/index.html", {
        "posts": serializers.serialize('json', Post.objects.all())
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def get_posts(request, which_posts):
    # which_posts can be either "all" or a username or "following"
    if which_posts == "all":
        posts = Post.objects
    elif which_posts == "following":
        if request.user.is_authenticated:
            posts = Post.objects.filter(writer__in=request.user.following.all())
        else:
            return JsonResponse({"error": "You are not logged in :("}, status=400)
    else:
        # which_posts better be  a username
        posts = Post.objects.filter(writer__username=which_posts)

    ordered_posts = posts.order_by("-time_modified").all()
    return JsonResponse([post.serialize() for post in ordered_posts], safe=False)
