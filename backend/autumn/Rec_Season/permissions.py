from rest_framework.permissions import BasePermission

class IsAllowedToAccessScore(BasePermission):
    message="Permission Denied"

    def has_object_permission(self, request, view,obj):
        if request.year==2: #2nd yearites cannot access candidate scores
            return False
        
        return True


class IsAllowedToAssignQuestion(BasePermission):
    message="Permission Denied"

    # def has_object_permission(self,request,view) #only certain members are eligible to assign questions based on certaiin criteria