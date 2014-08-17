task :deploy, :env, :remote do |t, args|
  sh "git checkout #{args[:env]}"
  sh 'git merge master -m "Merging for deployment"'
  sh 'build.sh'

  sh 'git add -A'
  sh 'git commit -m "Compile for deployment"'

  sh "git push #{args[:remote]} head:master"
end
