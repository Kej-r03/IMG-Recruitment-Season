# Generated by Django 4.1 on 2022-10-09 06:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Rec_Season', '0004_alter_candidate_current_year_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidate',
            name='phone',
            field=models.CharField(max_length=20),
        ),
    ]
