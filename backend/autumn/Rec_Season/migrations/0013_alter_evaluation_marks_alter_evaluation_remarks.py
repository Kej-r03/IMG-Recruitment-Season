# Generated by Django 4.1 on 2022-10-23 06:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Rec_Season', '0012_alter_candidateseasondata_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='evaluation',
            name='marks',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='evaluation',
            name='remarks',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
