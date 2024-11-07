To get one, authenticate to your dashboard by running:

    ggshield auth login

If you are using an on-prem version of GitGuardian, use the --instance option to point to it.
Read the following documentation for more information: https://docs.gitguardian.com/ggshield-docs/reference/auth/login
2024-11-07 16:14:38.446 [info] > git config --get-all user.name [149ms]
2024-11-07 16:14:38.618 [info] > git config --get-all user.email [153ms]
2024-11-07 16:14:38.824 [info] > git config --get commit.template [189ms]
2024-11-07 16:14:38.917 [info] > git for-each-ref --format=%(refname)%00%(upstream:short)%00%(objectname)%00%(upstream:track)%00%(upstream:remotename)%00%(upstream:remoteref) --ignore-case refs/heads/staging refs/remotes/staging [263ms]
2024-11-07 16:14:39.162 [info] > git status -z -uall [224ms]
2024-11-07 16:14:39.199 [info] > git for-each-ref --sort -committerdate --format %(refname) %(objectname) %(*objectname) [240ms]
