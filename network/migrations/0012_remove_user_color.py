# Generated by Django 3.0.3 on 2020-07-27 15:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0011_user_color'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='color',
        ),
    ]
