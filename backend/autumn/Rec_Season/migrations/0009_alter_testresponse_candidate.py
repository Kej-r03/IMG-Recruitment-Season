# Generated by Django 4.1 on 2022-10-12 10:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Rec_Season', '0008_alter_candidateseasondata_project_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='testresponse',
            name='candidate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Rec_Season.candidateseasondata'),
        ),
    ]
