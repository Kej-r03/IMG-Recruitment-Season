from rest_framework import BasePermission, SAFE_METHODS

class IsAllowedToAccessScore(BasePermission):
    message="Permission Denied"

    def has_object_permission(self, request, view,obj):
        if request.year==2: #2nd yearites cannot access candidae scores
            return False
        
        return True


class IsAllowedToAssignQuestion(BasePermission):
    message="Permission Denied"

    # def has_object_permission(self,request,view) #only certain members are eligible to assign questions based on certaiin criteria