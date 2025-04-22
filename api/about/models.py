from django.db import models

class About(models.Model):
    name = models.CharField(max_length=200, default="Ali")
    profile_pic = models.ImageField(upload_to='profile/',null=True)
    how_you_describe_yourself = models.CharField(max_length=250,null=True,blank=True,default='عاشق سفر')
    bio = models.TextField() 
    vision = models.TextField() 
    main_image = models.ImageField(upload_to="about/", null=True,blank=True)
    site_logo = models.ImageField(upload_to="logo/", blank=True, null=True)
    social_facebook = models.URLField(blank=True, null=True)
    social_twitter = models.URLField(blank=True, null=True)
    social_instagram = models.URLField(blank=True, null=True)
    social_youtube = models.URLField(blank=True, null=True)
    
    def get_profile_pic(self):
        if self.profile_pic:
            return self.profile_pic.url
        return 'https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg'

class Gallery(models.Model):
    about = models.ForeignKey(About, on_delete=models.CASCADE, related_name="gallery")
    image = models.ImageField(upload_to="gallery/")
    title = models.CharField(max_length=255)
